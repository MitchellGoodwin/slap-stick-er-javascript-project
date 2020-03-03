class ChangeCostToBeDecimalInImages < ActiveRecord::Migration[6.0]
  def up
    change_column :images, :cost, :decimal, precision: 5, scale: 2
  end

  def down
    change_column :images, :cost, :integer
  end
end
