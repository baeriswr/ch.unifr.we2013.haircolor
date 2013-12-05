class CreateIngredients < ActiveRecord::Migration
  def change
    create_table :ingredients do |t|
      t.string :inci_name,         :null => false, :default => ""
      t.string :formula,           :null => false, :default => ""
      t.string :structure,         :null => false, :default => "noimg.svg"
      t.string :cas_number,        :null => false, :default => ""
      t.string :ec_number,         :default => ""
      t.decimal :molecular_weight, :default => 0.0

      t.timestamps
    end
	 
	 add_index :ingredients, :inci_name, :unique => true
	 add_index :ingredients, :cas_number, :unique => true
  end
end
