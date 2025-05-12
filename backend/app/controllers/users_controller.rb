class UsersController < ApplicationController

  def signup
    result = UserService.new(user_params).signup

    if result[:success]
      render json: { message: result[:message] }, status: :created
    else
      render json: { errors: result[:errors] }, status: :unprocessable_entity
    end
  end

  def login
    result = UserService.new(email: params[:email], password: params[:password]).authenticate

    if result[:success]
      render json: result, status: :ok
    else
      render json: { errors: result[:errors] }, status: :unauthorized
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password)
  end
end