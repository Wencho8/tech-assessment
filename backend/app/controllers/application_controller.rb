class ApplicationController < ActionController::API
  private

    def authenticate_user
      token = request
                .headers['Authorization']
                &.split(' ')
                &.last      
        if token
          payload = JwtService.decode(token)
        if payload && payload['exp'] > Time.current.to_i
          @current_user = UserService.find_user_by_id(payload['user_id'])
        end
      end
  
      render json: { error: 'Unauthorized' }, status: :unauthorized unless @current_user
    end
  
    def current_user
      @current_user
    end
end
