class User < ApplicationRecord
  has_secure_password

  enum :role, { normal: 0, admin: 1 }

  has_many :orders, dependent: :destroy

  validates :email, presence: true, uniqueness: true
  validates :password, presence: true, length: { minimum: 6 }

  before_create :set_default_role

  private

  def set_default_role
    self.role ||= :normal
  end
end