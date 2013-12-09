# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Article.create(:name => "Art1", :manufacturer => "Man1")
Article.create(:name => "Art2", :manufacturer => "Man2")
Article.create(:name => "Art3", :manufacturer => "Man1")
Article.create(:name => "Art4", :manufacturer => "Man2")
Article.create(:name => "Art5", :manufacturer => "Man1")
Article.create(:name => "Art6", :manufacturer => "Man2")

Ingredient.create(:inci_name => "Inci1", :formula => "Form1", :cas_number => "123456", :ec_number => "123456", :molecular_weight => 123.456)
Ingredient.create(:inci_name => "Inci2", :formula => "Form2", :cas_number => "134567", :ec_number => "134567", :molecular_weight => 134.567)
Ingredient.create(:inci_name => "Inci3", :formula => "Form3", :cas_number => "145678", :ec_number => "145678", :molecular_weight => 145.678)
Ingredient.create(:inci_name => "Inci4", :formula => "Form4", :cas_number => "156789", :ec_number => "156789", :molecular_weight => 156.789)
Ingredient.create(:inci_name => "Inci5", :formula => "Form5", :cas_number => "167890", :ec_number => "167890", :molecular_weight => 167.890)

# Populate the 'quantities' table
articles = Article.all
articles.each do |article|
  article.ingredients = Ingredient.all
  i = 1
  article.quantities.each do |quantity|
	 quantity.position = i
	 i = i + 1
	 quantity.save
  end
end
