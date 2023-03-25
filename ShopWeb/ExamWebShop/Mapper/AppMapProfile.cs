using AutoMapper;
using ExamWebShop.Data.Entities;
using ExamWebShop.Data.Entities.Identity;
using ExamWebShop.Models.Account;
using ExamWebShop.Models.Auth;
using ExamWebShop.Models.Categories;
using ExamWebShop.Models.Orders;
using ExamWebShop.Models.Products;
using ExamWebShop.Models.Sales;
using ExamWebShop.Models.Users;
using System;

namespace ExamWebShop.Mapper
{
    public class AppMapProfile : Profile
    {
        public AppMapProfile()
        {
            CreateMap<RegisterViewModel, UserEntity>()
                .ForMember(x => x.UserName, dto => dto.MapFrom(x => x.Email));
            CreateMap<BasketEntity, BasketItemViewModel>();

            CreateMap<CategoryEntity, CategoryItemViewModel>();
            CreateMap<CategoryCreateViewModel, CategoryEntity>();
            CreateMap<CategoryEntity, CategoryMainItemViewModel>()
                .ForMember(x => x.CountProducts, opt => opt.MapFrom(x => x.Products.Count));

            CreateMap<ProductEntity, ProductItemViewModel>()
                .ForMember(x => x.Category, dto => dto.MapFrom(x => x.Category.Name))
                .ForMember(x => x.Images, dto => dto.MapFrom(x => x.Images.Select(x => x.Name)))
                .ForMember(x => x.DecreasePercent, dto => dto.MapFrom(x => x.SaleProducts.Count > 0 ? x.SaleProducts.First().Sale.DecreasePercent : 0 ));
            CreateMap<CreateProductViewModel, ProductEntity>().ForMember(x => x.Images, opt => opt.Ignore());

            CreateMap<SaleEntity, SaleTableItemViewModel>()
                .ForMember(x=>x.ProductCount, opt=> opt.MapFrom(x=>x.SaleProducts.Count));
            CreateMap<SaleCreateViewModel, SaleEntity>()
                .ForMember(x=>x.ExpireTime, opt=>opt.MapFrom(x=>DateTime.SpecifyKind(x.ExpireTime,DateTimeKind.Utc)));
            CreateMap<SaleEditViewModel, SaleEntity>()
                .ForMember(x => x.ExpireTime, opt => opt.MapFrom(x => DateTime.SpecifyKind(x.ExpireTime, DateTimeKind.Utc)));


            CreateMap<OrderItemEntity, OrderProductItemViewModel>()
                .ForMember(x => x.Id, opt => opt.MapFrom(x => x.ProductId))
                .ForMember(x => x.ProductName, opt => opt.MapFrom(x => x.Product.Name))
                .ForMember(x => x.CategoryName, opt => opt.MapFrom(x => x.Product.Category.Name))
                .ForMember(x => x.PriceBuy, opt => opt.MapFrom(x => x.PriceBuy))
                .ForMember(x => x.ProductImage, opt => opt.MapFrom(x => x.Product.Images.FirstOrDefault().Name))
                .ForMember(x => x.Count, opt => opt.MapFrom(x => x.Count));
            CreateMap<OrderEntity, OrderItemViewModel>()
                .ForMember(x => x.OrderStatus, opt => opt.MapFrom(x => x.OrderStatus.Name))
                .ForMember(x => x.Products, opt => opt.MapFrom(x => x.OrderItems));
            CreateMap<OrderEntity, OrderTableItemViewModel>()
               .ForMember(x => x.OrderStatus, opt => opt.MapFrom(x => x.OrderStatus.Name))
               .ForMember(x => x.Products, opt => opt.MapFrom(x => x.OrderItems))
               .ForMember(x => x.Email, opt => opt.MapFrom(x => x.User.Email))
               .ForMember(x => x.Name, opt => opt.MapFrom(x => $"{x.User.FirstName} {x.User.LastName}"))
               .ForMember(x => x.Image, opt => opt.MapFrom(x => x.User.Image));

            CreateMap<UserEntity, UserItemViewModel>()
                .ForMember(x => x.Banned, opt => opt.MapFrom(x => x.LockoutEnd != null))
                .ForMember(x => x.BannedTo, opt => opt.MapFrom(x => x.LockoutEnd.ToString()))
                .ForMember(x => x.Fullname, opt => opt.MapFrom(x => $"{x.FirstName} {x.LastName}"))
                .ForMember(x => x.Roles, opt => opt.MapFrom(x => string.Join(" ", x.UserRoles.Where(r => r.UserId == x.Id).Select(x => x.Role.Name))))
                .ForMember(x => x.Cart, opt => opt.MapFrom(x => x.Baskets.Where(r => r.UserId == x.Id)));
        }
    }
}
