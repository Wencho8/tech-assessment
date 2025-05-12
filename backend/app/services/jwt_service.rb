# Service for encoding and decoding JWT authentication tokens
class JwtService
  # Secret key used for signing JWT tokens
  HMAC_SECRET = Rails.application.credentials.secret_key_base

  # Encodes a payload into a JWT token
  def self.encode(payload)
    JWT.encode(payload, HMAC_SECRET)
  end

  # Decodes a JWT token into a payload hash
  def self.decode(token)
    JWT.decode(token, HMAC_SECRET).first
  rescue JWT::DecodeError => e
    Rails.logger.error "JWT Decode Error: #{e.message}"
    nil
  end
end