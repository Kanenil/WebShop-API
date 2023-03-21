using AutoMapper;
using ExamWebShop.Data.Entities;
using ExamWebShop.Data.Entities.Identity;
using ExamWebShop.Models.Account;
using ExamWebShop.Models.Auth;
using ExamWebShop.Models.Categories;
using ExamWebShop.Models.Products;
using ExamWebShop.Models.Sales;
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

        }
    }
}
