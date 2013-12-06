class CreateArticles < ActiveRecord::Migration
  def change
    create_table :articles do |t|
      t.string :name,         :null => false, :default => ""
      t.string :manufacturer, :null => false, :default => ""
      t.string :image,        :null => false, :default => "noimg.svg"

      t.timestamps
    end
	 
	 add_index :articles, :name, :unique => true
  end
end
