# Service for creating, updating, and managing the lifecycle of orders
class OrderService
  # Initialize with current user, optional order and order parameters
  def initialize(current_user, order = nil, order_params = {})
    @current_user = current_user
    @order = order
    @order_params = order_params
  end

  # Creates a new order with the specified items
  def create_order
    order = @current_user.orders.new

    Order.transaction do
      @order_params[:items].each do |item_data|
        item = Item.find(item_data[:id])
        order.order_items.build(
          item:       item,
          quantity:   item_data[:quantity],
          unit_price: item.price
        )
      end
      order.save!
    end

    { order: order }

  rescue ActiveRecord::RecordInvalid => e
    { error: e.message }
  end

  # Updates the items in an existing pending order
  def update_order(order_items_params)
    return { success: false, error: "Cannot update a #{@order.state} order" } unless @order.state == "pending"
    
    Order.transaction do
      @order.order_items.destroy_all
      
      order_items_params.each do |item_data|
        item = Item.find(item_data[:id])
        @order.order_items.build(
          item: item,
          quantity: item_data[:quantity],
          unit_price: item.price
        )
      end
      
      @order.save!
      { success: true, order: @order }
    end
  rescue ActiveRecord::RecordInvalid, ActiveRecord::RecordNotFound => e
    { success: false, error: e.message }
  end


  # Retrieves all orders for the current user or all orders if admin
  def fetch_orders
    scope = @current_user.admin? ? Order.includes(:user) : @current_user.orders
    
    scope.select(:id, :total_price, :created_at, :user_id, :state).map do |o|
      order_data = {
        id:          o.id,
        total_price: o.total_price,
        placed_at:   o.created_at,
        state:       o.state
      }
      
      if @current_user.admin?
        order_data[:user_email] = o.user.email
      end
      
      order_data
    end
  end

  # Formats an order for JSON API response with appropriate data for the user
  def format_order
    json_options = {
      only: [:id, :total_price, :created_at, :state],
      include: {
        order_items: {
          only: [:quantity, :unit_price],
          include: {
            item: {
              only: [:id, :name, :price]
            }
          }
        }
      }
    }
  
    if @current_user.admin?
      json_options[:include][:user] = { only: [:email] }
    end
    
    @order.as_json(json_options)
  end


  # Marks an order as completed, changes AASM state
  def complete_order
    if @order.complete!
      { success: true }
    else
      { success: false, error: "Cannot complete the order" }
    end
  rescue AASM::InvalidTransition => e
    { success: false, error: "Cannot transition from #{@order.state} to completed" }
  end

  
  # Cancels an order, changes AASM state
  def cancel_order
    if @order.cancel!
      { success: true }
    else
      { success: false, error: "Cannot cancel the order" }
    end
  rescue AASM::InvalidTransition => e
    { success: false, error: "Cannot transition from #{@order.state} to canceled" }
  end
end
