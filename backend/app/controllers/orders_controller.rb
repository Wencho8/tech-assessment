class OrdersController < ApplicationController
  before_action :authenticate_user
  before_action :set_order, only: [:show, :update, :complete, :cancel]

  def create
    result = OrderService.new(current_user, nil, order_params).create_order

    if result[:order]
      render json: result[:order], status: :created
    else
      render json: { error: result[:error] }, status: :unprocessable_entity
    end
  end

  def index
    orders = OrderService.new(current_user).fetch_orders
    render json: orders, status: :ok
  end

  def show
    render json: OrderService.new(current_user, @order).format_order, status: :ok
  end

  def update
    result = OrderService.new(current_user, @order).update_order(order_params[:items])
    
    if result[:success]
      render json: OrderService.new(current_user, result[:order]).format_order, status: :ok
    else
      render json: { error: result[:error] }, status: :unprocessable_entity
    end
  end

  def complete
    result = OrderService.new(current_user, @order).complete_order
    
    if result[:success]
      render json: { message: "Order completed successfully" }, status: :ok
    else
      render json: { error: result[:error] }, status: :unprocessable_entity
    end
  end

  def cancel
    result = OrderService.new(current_user, @order).cancel_order
    
    if result[:success]
      render json: { message: "Order canceled successfully" }, status: :ok
    else
      render json: { error: result[:error] }, status: :unprocessable_entity
    end
  end

  private

  def set_order
    scope = current_user.admin? ? Order : current_user.orders
    @order = scope.find_by(id: params[:id])
  
    unless @order
      render json: { error: "Order not found" }, status: :not_found
      return false
    end
  end

  def order_params
    params.require(:order).permit(items: [:id, :quantity])
  end
end
