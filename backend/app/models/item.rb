class Item < ApplicationRecord
  has_many :order_items, dependent: :restrict_with_error
  has_many :orders, through: :order_items

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
end
