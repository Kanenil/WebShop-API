using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using ExamWebShop.Data.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using ExamWebShop.Data.Entities;
using System.Reflection.Emit;

namespace ExamWebShop.Data
{
    public class AppEFContext : IdentityDbContext<UserEntity, RoleEntity, int,
        IdentityUserClaim<int>, UserRoleEntity, IdentityUserLogin<int>,
        IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public AppEFContext(DbContextOptions<AppEFContext> options) : base(options) { }
        public DbSet<CategoryEntity> Categories => Set<CategoryEntity>();
        public DbSet<ProductEntity> Products => Set<ProductEntity>();
        public DbSet<ProductImageEntity> ProductImages => Set<ProductImageEntity>();
        public DbSet<SaleEntity> Sales => Set<SaleEntity>();
        public DbSet<SaleProductEntity> SaleProducts => Set<SaleProductEntity>();
        public DbSet<BasketEntity> Baskets => Set<BasketEntity>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<UserRoleEntity>(ur =>
            {
                ur.HasKey(ur => new { ur.UserId, ur.RoleId });

                ur.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(r => r.RoleId)
                    .IsRequired();

                ur.HasOne(ur => ur.User)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(u => u.UserId)
                    .IsRequired();
            });
            builder.Entity<SaleProductEntity>(sales =>
            {
                sales.HasKey(b => new { b.SaleId, b.ProductId });
            });
            builder.Entity<BasketEntity>(basket =>
            {
                basket.HasKey(b => new { b.UserId, b.ProductId });
            });
        }
    }
}
