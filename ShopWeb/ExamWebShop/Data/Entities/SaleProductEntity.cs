using System.ComponentModel.DataAnnotations.Schema;

namespace ExamWebShop.Data.Entities
{
    [Table("tblSaleProducts")]
    public class SaleProductEntity
    {
        [ForeignKey("Product")]
        public int ProductId { get; set; }
        [ForeignKey("Sale")]
        public int SaleId { get; set; }

        public virtual ProductEntity Product { get; set; }
        public virtual SaleEntity Sale { get; set; }
    }
}
