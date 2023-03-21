using AutoMapper;
using ExamWebShop.Constants;
using ExamWebShop.Interfaces;
using ExamWebShop.Models.Categories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoriesService _categoriesService;
        private readonly IMapper _mapper;

        public CategoriesController(ICategoriesService categoriesService, IMapper mapper)
        {
            _categoriesService = categoriesService;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetList([FromQuery] CategorySearchViewModel model)
        {
            var query = _categoriesService.Categories
                .Where(x => !x.IsDeleted)
                .AsQueryable();

            if (!string.IsNullOrEmpty(model.Search))
            {
                query = query.Where(x => x.Name.ToLower().Contains(model.Search.ToLower()));
            }

            var list = query
                .Skip((model.Page - 1) * model.CountOnPage)
                .Take(model.CountOnPage)
                .Select(x => _mapper.Map<CategoryItemViewModel>(x))
                .ToList();
            int total = query.Count();
            int pages = (int)Math.Ceiling(total / (double)model.CountOnPage);

            return Ok(new CategorySearchResultViewModel()
            {
                CurrentPage = model.Page,
                Pages = pages,
                Total = total,
                Categories = list,
            });
        }
        [HttpGet("mainPage")]
        public IActionResult GetCategories()
        {
            var list = _categoriesService.Categories
                .Include(x=>x.Products)
                .Where(x => !x.IsDeleted)
                .OrderBy(x => x.Name)
                .Select(x => _mapper.Map<CategoryMainItemViewModel>(x))
                .ToList();
            return Ok(list);
        }

        [HttpGet("selector")]
        public IActionResult GetSelector()
        {
            var list = _categoriesService.Categories
                .Where(x => !x.IsDeleted)
                .OrderBy(x => x.Id)
                .Select(x => _mapper.Map<CategoryItemViewModel>(x))
                .ToList();
            return Ok(list);
        }

        [HttpGet("id/{id}")]
        public IActionResult GetCategory(int id)
        {
            var model = _categoriesService.Categories.SingleOrDefault(x => x.Id == id);
            if (model == null)
                return NotFound();
            return Ok(_mapper.Map<CategoryItemViewModel>(model));
        }

        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Create([FromBody] CategoryCreateViewModel model)
        {
            await _categoriesService.Create(model);
            return Ok();
        }

        [HttpPut]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Edit([FromBody] CategoryEditViewModel model)
        {
            await _categoriesService.Update(model);
            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Delete(int id)
        {
            await _categoriesService.Delete(id);
            return Ok();
        }
    }
}
