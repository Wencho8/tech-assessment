# Service for managing item operations with admin authorization checks
class ItemService
  # Initialize with current user, optional item and item parameters
  def initialize(current_user, item = nil, item_params = {})
    @current_user = current_user
    @item = item
    @item_params = item_params
  end


  # Creates a new item
  def create_item
    return forbidden_response unless @current_user.admin?

    item = Item.new(@item_params)
    item.save!
    { item: item }
  rescue ActiveRecord::RecordInvalid => e
    { error: item.errors.full_messages }
  end


  # Updates an existing item
  def update_item
    return forbidden_response unless @current_user.admin?

    @item.update!(@item_params.except(:id))
    { item: @item }
  rescue ActiveRecord::RecordInvalid => e
    { error: @item.errors.full_messages }
  end
  

  # Deletes an item
  def destroy_item
    return forbidden_response unless @current_user.admin?

    @item.destroy!
    { success: true }
  rescue ActiveRecord::RecordNotDestroyed => e
    { error: @item.errors.full_messages }
  end

  
  private


  # Returns a standard forbidden error response
  def forbidden_response
    { error: 'Forbidden' }
  end
end