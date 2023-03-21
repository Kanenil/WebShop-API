using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamWebShop.Data.Entities
{
    [Table("tblSales")]
    public class SaleEntity : BaseEntity<int>
    {
        [Required, StringLength(255)]
        public string Name { get; set; }
        [Required, StringLength(255)]
        public string Image { get; set; }
        [StringLength(4000)]
        public string Description { get; set; }
        public int DecreasePercent { get; set; }
        public DateTime ExpireTime { get; set; }
        public virtual ICollection<SaleProductEntity> SaleProducts { get; set; }
    }
}
