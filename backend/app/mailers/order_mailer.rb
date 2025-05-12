# Mailer responsible for sending order-related email notifications to users
class OrderMailer < ApplicationMailer
  # Sends an email notification to the user when their order is completed
  # @param order [Order] the order that has been completed
  def order_completed_email(order)
    @order = order
    @user = order.user
    mail(to: @user.email, subject: 'Your Order Has Been Completed')
  end
end
