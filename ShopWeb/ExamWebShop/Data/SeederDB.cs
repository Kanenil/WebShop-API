using ExamWebShop.Constants;
using ExamWebShop.Data.Entities;
using ExamWebShop.Data.Entities.Identity;
using ExamWebShop.Helpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Drawing.Imaging;

namespace ExamWebShop.Data
{
    public static class SeederDB
    {
        public static void SeedData(this IApplicationBuilder app)
        {
            using (var scope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppEFContext>();
                var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
                context.Database.Migrate();

                var userManager = scope.ServiceProvider
                    .GetRequiredService<UserManager<UserEntity>>();

                var roleManager = scope.ServiceProvider
                    .GetRequiredService<RoleManager<RoleEntity>>();

                if (!context.Roles.Any())
                {
                    foreach (var role in Roles.All)
                    {
                        var result = roleManager.CreateAsync(new RoleEntity
                        {
                            Name = role
                        }).Result;
                    }
                }

                if (!context.Users.Any())
                {
                    UserEntity user = new()
                    {
                        FirstName = "Admin",
                        LastName = "Admin",
                        Email = "admin@gmail.com",
                        UserName = "admin@gmail.com",
                    };
                    var result = userManager.CreateAsync(user, "123456")
                        .Result;
                    if (result.Succeeded)
                    {
                        result = userManager
                            .AddToRoleAsync(user, Roles.Admin)
                            .Result;
                    }
                }

                if(!context.Categories.Any())
                {
                    CategoryEntity cat1 = new()
                    {
                        Name = "Ноутбуки",
                        Image = ImageWorker.SaveImage(@"https://video.rozetka.com.ua/img_superportal/kompyutery_i_noutbuki/noutbuki.png", configuration)
                    };
                    CategoryEntity cat2 = new()
                    {
                        Name = "Монітори",
                        Image = ImageWorker.SaveImage(@"https://video.rozetka.com.ua/img_superportal/kompyutery_i_noutbuki/monitory.png", configuration)
                    };
                    CategoryEntity cat3 = new()
                    {
                        Name = "Планшети",
                        Image = ImageWorker.SaveImage(@"https://video.rozetka.com.ua/img_superportal/kompyutery_i_noutbuki/planshety.png", configuration)
                    };
                    CategoryEntity cat4 = new()
                    {
                        Name = "Комп'ютери",
                        Image = ImageWorker.SaveImage(@"https://video.rozetka.com.ua/img_superportal/kompyutery_i_noutbuki/kompyutery.png", configuration)
                    };
                    CategoryEntity cat5 = new()
                    {
                        Name = "Клавіатури та миші",
                        Image = ImageWorker.SaveImage(@"https://video.rozetka.com.ua/img_superportal/kompyutery_i_noutbuki/klaviatury-i-myshi.png", configuration)
                    };

                    context.Categories.AddRange(cat1,cat2, cat3, cat4, cat5);
                    context.SaveChanges();
                }

                if(!context.Products.Any())
                {
                    #region Product 1
                    ProductEntity prod1 = new()
                    {
                        Name = "Ноутбук ASUS TUF Gaming A15 FA506ICB-HN119 (90NR0667-M00KT0) Graphite Black / AMD Ryzen 5 4600H / RAM 16 ГБ / SSD 512 ГБ / nVidia GeForce RTX 3050",
                        Price = 44999,
                        Description = "Экран 15.6\" IPS (1920x1080) Full HD 144 Гц, матовый / AMD Ryzen 5 4600H (3.0 - 4.0 ГГц) / RAM 16 ГБ / SSD 512 ГБ / nVidia GeForce RTX 3050, 4 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / веб-камера / без ОС / 2.3 кг / черный",
                        CategoryId = 1
                    };

                    ProductImageEntity prod1Img1 = new()
                    {
                        Name = ImageWorker.SaveImage(@"https://content1.rozetka.com.ua/goods/images/big/302686477.jpg", configuration),
                        Priority = 1,
                        ProductId = 1
                    };

                    ProductImageEntity prod1Img2 = new()
                    {
                        Name = ImageWorker.SaveImage(@"https://content.rozetka.com.ua/goods/images/big/302686482.jpg", configuration),
                        Priority = 2,
                        ProductId = 1
                    };

                    ProductImageEntity prod1Img3 = new()
                    {
                        Name = ImageWorker.SaveImage(@"https://content1.rozetka.com.ua/goods/images/big/302686479.jpg", configuration),
                        Priority = 3,
                        ProductId = 1
                    };

                    ProductImageEntity prod1Img4 = new()
                    {
                        Name = ImageWorker.SaveImage(@"https://content1.rozetka.com.ua/goods/images/big/302686483.jpg", configuration),
                        Priority = 4,
                        ProductId = 1
                    };

                    ProductImageEntity prod1Img5 = new()
                    {
                        Name = ImageWorker.SaveImage(@"https://content1.rozetka.com.ua/goods/images/big/302686478.jpg", configuration),
                        Priority = 5,
                        ProductId = 1
                    };
                    #endregion
                    #region Product 2
                    ProductEntity prod2 = new()
                    {
                        Name = "Ноутбук Apple MacBook Air 13\" M1 256GB 2020 (MGND3) Gold",
                        Price = 48999,
                        Description = "Екран 13.3\" Retina (2560x1600) WQXGA, глянсовий / Apple M1 / RAM 8 ГБ / SSD 256 ГБ / Apple M1 Graphics / Wi-Fi / Bluetooth / macOS Big Sur / 1.29 кг / золотий",
                        CategoryId = 1
                    };

                    ProductImageEntity prod2Img1 = new()
                    {
                        Name = ImageWorker.SaveImage(@"https://content.rozetka.com.ua/goods/images/big/30872664.jpg", configuration),
                        Priority = 1,
                        ProductId = 2
                    };

                    ProductImageEntity prod2Img2 = new()
                    {
                        Name = ImageWorker.SaveImage(@"https://content1.rozetka.com.ua/goods/images/big/30872671.jpg", configuration),
                        Priority = 2,
                        ProductId = 2
                    };

                    ProductImageEntity prod2Img3 = new()
                    {
                        Name = ImageWorker.SaveImage(@"https://content2.rozetka.com.ua/goods/images/big/30872676.jpg", configuration),
                        Priority = 3,
                        ProductId = 2
                    };

                    ProductImageEntity prod2Img4 = new()
                    {
                        Name = ImageWorker.SaveImage(@"https://content.rozetka.com.ua/goods/images/big/30872706.jpg", configuration),
                        Priority = 4,
                        ProductId = 2
                    };

                    ProductImageEntity prod2Img5 = new()
                    {
                        Name = ImageWorker.SaveImage(@"https://content2.rozetka.com.ua/goods/images/big/30872684.jpg", configuration),
                        Priority = 5,
                        ProductId = 2
                    };
                    #endregion
                    #region Product 3
                    ProductEntity prod3 = new()
                    {
                        Name = "Монітор 27\" Asus TUF Gaming VG27AQZ (90LM0503-B01370) -- IPS / 8-Bit / 165 Гц / G-Sync Сompatible / Adaptive-Sync / HDR10",
                        Price = 48999,
                        Description = "",
                        CategoryId = 2
                    };

                    ProductImageEntity prod3Img1 = new()
                    {
                        Name = ImageWorker.SaveImage(@"https://content1.rozetka.com.ua/goods/images/big/272567547.jpg", configuration),
                        Priority = 1,
                        ProductId = 3
                    };

                    ProductImageEntity prod3Img2 = new()
                    {
                        Name = ImageWorker.SaveImage(@"https://content.rozetka.com.ua/goods/images/big/272567548.jpg", configuration),
                        Priority = 2,
                        ProductId = 3
                    };

                    ProductImageEntity prod3Img3 = new()
                    {
                        Name = ImageWorker.SaveImage(@"https://content.rozetka.com.ua/goods/images/big/272567549.jpg", configuration),
                        Priority = 3,
                        ProductId = 3
                    };

                    ProductImageEntity prod3Img4 = new()
                    {
                        Name = ImageWorker.SaveImage(@"https://content1.rozetka.com.ua/goods/images/big/272567550.jpg", configuration),
                        Priority = 4,
                        ProductId = 3
                    };

                    ProductImageEntity prod3Img5 = new()
                    {
                        Name = ImageWorker.SaveImage(@"https://content.rozetka.com.ua/goods/images/big/272567552.jpg", configuration),
                        Priority = 5,
                        ProductId = 3
                    };
                    #endregion

                    context.Products.AddRange(prod1, prod2, prod3);
                    context.SaveChanges();

                    context.ProductImages.AddRange(prod1Img1, prod1Img2, prod1Img3, prod1Img4, prod1Img5, 
                        prod2Img1, prod2Img2, prod2Img3, prod2Img4, prod2Img5,
                        prod3Img1, prod3Img2, prod3Img3, prod3Img4, prod3Img5);
                    context.SaveChanges();
                }
            }
        }
    }
}
