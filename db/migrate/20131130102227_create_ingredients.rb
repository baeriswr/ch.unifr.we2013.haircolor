class CreateIngredients < ActiveRecord::Migration
  def change
    create_table :ingredients do |t|
      t.string :inci_name
      t.string :forumla
      t.string :structure
      t.string :cas_number
      t.string :ec_number
      t.string :molecular_weight

      t.timestamps
    end
  end
end
