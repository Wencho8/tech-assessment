class ItemsController < ApplicationController
  before_action :authenticate_user
  before_action :authorize_admin, only: [:create, :update, :destroy]
  before_action :set_item, only: [:update, :destroy]

  def create
    result = ItemService.new(nil, item_params).create_item
    if result[:item]
      render json: result[:item], status: :created
    else
      render json: { error: result[:error] }, status: :unprocessable_entity
    end
  end

  def update
    result = ItemService.new(@item, item_params).update_item
    if result[:item]
      render json: result[:item], status: :ok
    else
      render json: { error: result[:error] }, status: :unprocessable_entity
    end
  end

  def destroy
    result = ItemService.new(@item).destroy_item
    if result[:success]
      render json: { message: 'Item deleted successfully' }, status: :ok
    else
      render json: { error: result[:error] }, status: :unprocessable_entity
    end
  end

  def index
    items = Item.find_each
    render json: items, status: :ok
  end

  private

  def set_item
    @item = Item.find_by(id: params[:id])
    
    unless @item
      render json: { error: "Item not found" }, status: :not_found
      return false
    end
  end

  def item_params
    params.require(:item).permit(:name, :price)
  end

  def authorize_admin
    render json: { error: 'Forbidden' }, status: :forbidden unless current_user.admin?
  end
end
