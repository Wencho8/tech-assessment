class Order < ApplicationRecord
  include AASM

  belongs_to :user
  has_many   :order_items, dependent: :destroy
  has_many   :items, through: :order_items

  before_save :calculate_total_price

  aasm column: 'state' do
    state :pending, initial: true
    state :completed
    state :canceled

    event :complete do
      transitions from: :pending, to: :completed, after: :send_order_completed_email
    end

    event :cancel do
      transitions from: :pending, to: :canceled
    end
  end

  private

  def calculate_total_price
    self.total_price = order_items.sum { |order_item| order_item.quantity * order_item.unit_price }
  end

  def send_order_completed_email
    OrderMailer.order_completed_email(self).deliver_later
  end
end
