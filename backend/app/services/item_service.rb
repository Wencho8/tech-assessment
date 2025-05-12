# Service for managing item operations
class ItemService
  # Initialize with optional item and item parameters
  def initialize(item = nil, item_params = {})
    @item = item
    @item_params = item_params
  end


  # Creates a new item
  def create_item
    item = Item.new(@item_params)
    item.save!
    { item: item }
  rescue ActiveRecord::RecordInvalid => e
    { error: item.errors.full_messages }
  end


  # Updates an existing item
  def update_item
    @item.update!(@item_params.except(:id))
    { item: @item }
  rescue ActiveRecord::RecordInvalid => e
    { error: @item.errors.full_messages }
  end
  

  # Deletes an item
  def destroy_item
    @item.destroy!
    { success: true }
  rescue ActiveRecord::RecordNotDestroyed => e
    { error: @item.errors.full_messages }
  end

end