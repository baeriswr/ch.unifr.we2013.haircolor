class CreateQuantities < ActiveRecord::Migration
  def change
    create_table :quantities do |t|
		t.belongs_to :article
		t.belongs_to :ingredient
		t.integer :position
		t.timestamps
    end
  end
end
