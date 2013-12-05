class CreateQuantities < ActiveRecord::Migration
  def change
    create_table :quantities do |t|
		t.integer :position
		
		t.timestamps
    end
  end
end
