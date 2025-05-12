class AddStateToOrders < ActiveRecord::Migration[7.2]
  def change
    add_column :orders, :state, :string
  end
end
