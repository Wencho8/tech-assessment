# Service for user authentication, registration, and retrieval
class UserService
  # Initialize with user parameters
  def initialize(params = {})
    @params = params
    @email = params[:email]
    @password = params[:password]
  end

  # Register a new user
  def signup
    user = User.new(@params)
    user.save!
    { success: true, message: 'User created successfully', user: user }
  rescue ActiveRecord::RecordInvalid => e
    { success: false, errors: user.errors.full_messages }
  end

  # Authenticate a user with email and password
  def authenticate
    user = User.find_by(email: @email)
    
    if !user
      return { success: false, errors: ['User not found'] }
    end
    
    unless user.authenticate(@password)
      return { success: false, errors: ['Invalid password'] }
    end

    {
      success: true,
      token: JwtService.encode({ user_id: user.id, exp: 24.hours.from_now.to_i }),
      user: user
    }
  end
  
  # Find a user by their ID
  def self.find_user_by_id(user_id)
    User.find_by(id: user_id)
  end
end