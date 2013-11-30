class CreateArticles < ActiveRecord::Migration
  def change
    create_table :articles do |t|
      t.string :name
      t.string :manufacturer
      t.string :image

      t.timestamps
    end
  end
end
