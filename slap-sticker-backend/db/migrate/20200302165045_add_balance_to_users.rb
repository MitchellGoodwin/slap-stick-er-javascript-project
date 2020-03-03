class AddBalanceToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :balance, :decimal, precision: 6, scale: 2
  end
end
