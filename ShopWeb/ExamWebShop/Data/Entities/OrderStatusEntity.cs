using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamWebShop.Data.Entities
{
    [Table("tblOrderStatuses")]
    public class OrderStatusEntity : BaseEntity<int>
    {
        [Required, StringLength(255)]
        public string Name { get; set; }
        public virtual ICollection<OrderEntity> Orders { get; set; }
    }
}
