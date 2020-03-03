class CreateImages < ActiveRecord::Migration[6.0]
  def change
    create_table :images do |t|
      t.text :imgdata
      t.integer :cost
      t.boolean :for_sale      
      t.references :user, null: false, foreign_key: true
      
      t.timestamps
    end
  end
end
