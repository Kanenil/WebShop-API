using System.ComponentModel.DataAnnotations;

namespace ExamWebShop.Models.Sales
{
    public class SaleEditViewModel
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Image { get; set; }
        public string Description { get; set; }
        [Required]
        public int DecreasePercent { get; set; }
        [Required]
        public DateTime ExpireTime { get; set; }
    }
}
