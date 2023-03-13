using ExamWebShop.Constants;
using ExamWebShop.Data.Entities;
using ExamWebShop.Data.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ExamWebShop.Data
{
    public static class SeederDB
    {
        public static void SeedData(this IApplicationBuilder app)
        {
            using (var scope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppEFContext>();
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
                        Name = "Ноутбуки"
                    };
                    CategoryEntity cat2 = new()
                    {
                        Name = "Монітори"
                    };
                    CategoryEntity cat3 = new()
                    {
                        Name = "Планшети"
                    };
                    CategoryEntity cat4 = new()
                    {
                        Name = "Комп'ютери"
                    };
                    CategoryEntity cat5 = new()
                    {
                        Name = "Клавіатури та миші"
                    };

                    context.Categories.AddRange(cat1,cat2, cat3, cat4, cat5);
                    context.SaveChanges();
                }
            }
        }
    }
}
