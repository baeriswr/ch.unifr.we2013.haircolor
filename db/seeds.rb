# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


Article.create({:name => "Prod1", :manufacturer => "Man1", :image => "noimg.svg"})
Article.create({:name => "Prod2", :manufacturer => "Man1", :image => "noimg.svg"})
Article.create({:name => "Prod3", :manufacturer => "Man1", :image => "noimg.svg"})
Article.create({:name => "Prod4", :manufacturer => "Man2", :image => "noimg.svg"})
Article.create({:name => "Prod5", :manufacturer => "Man2", :image => "noimg.svg"})
Article.create({:name => "Prod6", :manufacturer => "Man2", :image => "noimg.svg"})

Ingredient.create({:inci_name => "Inci1", :formula => "Form1", :structure => "noimg.svg", :cas_number => "123456", :ec_number => "123456", :molecular_weight => "123.456"})
Ingredient.create({:inci_name => "Inci2", :formula => "Form2", :structure => "noimg.svg", :cas_number => "134567", :ec_number => "134567", :molecular_weight => "134.567"})
Ingredient.create({:inci_name => "Inci3", :formula => "Form3", :structure => "noimg.svg", :cas_number => "145678", :ec_number => "145678", :molecular_weight => "145.678"})
Ingredient.create({:inci_name => "Inci4", :formula => "Form4", :structure => "noimg.svg", :cas_number => "156789", :ec_number => "156789", :molecular_weight => "156.789"})
Ingredient.create({:inci_name => "Inci5", :formula => "Form5", :structure => "noimg.svg", :cas_number => "167890", :ec_number => "167890", :molecular_weight => "167.890"})