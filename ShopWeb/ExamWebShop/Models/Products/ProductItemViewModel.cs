namespace ExamWebShop.Models.Products
{
    public class ProductItemViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public int DecreasePercent { get; set; } = 0;
        public List<string> Images { get; set; }
    }
}
