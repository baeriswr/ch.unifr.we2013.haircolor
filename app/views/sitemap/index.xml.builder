xml.instruct!
xml.urlset "xmlns" => "http://www.sitemaps.org/schemas/sitemap/0.9" do

  xml.url do
    xml.loc "http://www.mysite.com"
    xml.priority 1.0
  end

  @articles.each do |article|
    xml.url do
      xml.loc article_url(article)
      xml.lastmod article.updated_at.to_date
      xml.priority 0.9
    end
  end

  @ingredients.each do |ingredient|
    xml.url do
      xml.loc ingredient_url(ingredient)
      xml.lastmod ingredient.updated_at.to_date
      xml.priority 0.9
    end
  end

end