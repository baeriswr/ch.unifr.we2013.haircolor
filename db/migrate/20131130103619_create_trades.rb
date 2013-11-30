class CreateTrades < ActiveRecord::Migration
  def change
    create_table :trades do |t|
      t.string :trade_name
      t.string :ingredient

      t.timestamps
    end
  end
end
