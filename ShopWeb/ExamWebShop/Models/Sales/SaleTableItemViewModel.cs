
namespace ExamWebShop.Models.Sales
{
    public class SaleTableItemViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string Description { get; set; }
        public int DecreasePercent { get; set; }
        public DateTime ExpireTime { get; set; }
        public int ProductCount { get; set; }
    }
}
