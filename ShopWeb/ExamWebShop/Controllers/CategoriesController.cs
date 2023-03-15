using AutoMapper;
using ExamWebShop.Constants;
using ExamWebShop.Data;
using ExamWebShop.Data.Entities;
using ExamWebShop.Helpers;
using ExamWebShop.Models;
using ExamWebShop.Models.Categories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Drawing.Printing;

namespace ExamWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Roles.Admin)]
    public class CategoriesController : ControllerBase
    {
        private readonly AppEFContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private const int MaxOnPage = 10;

        public CategoriesController(AppEFContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult GetList(int page, string search)
        {
            int.TryParse(search, out int number);
            var list = _context.Categories
                .Where(x => !x.IsDeleted && (search != null ? (x.Name.ToLower().Contains(search.ToLower()) || x.Id == number) : true))
                .OrderBy(x => x.Id)
                .Skip((page - 1) * MaxOnPage)
                .Take(MaxOnPage)
                .Select(x => _mapper.Map<CategoryItemViewModel>(x))
                .ToList();
            return Ok(list);
        }

        [HttpGet("id/{id}")]
        public IActionResult GetCategory(int id)
        {
            var model = _context.Categories.SingleOrDefault(x => x.Id == id);
            if (model == null)
                return NotFound();
            return Ok(_mapper.Map<CategoryItemViewModel>(model));
        }
        [HttpGet("count")]
        public IActionResult GetCount(string search)
        {
            int.TryParse(search, out int number);
            var count = _context.Categories
                .Where(x => !x.IsDeleted && (search != null ? (x.Name.ToLower().Contains(search.ToLower()) || x.Id == number) : true))
                .Count();
            return Ok(count);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoryCreateViewModel model)
        {
            var cat = _mapper.Map<CategoryEntity>(model);
            _context.Categories.Add(cat);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Edit([FromBody] CategoryEditViewModel model)
        {
            var data = _context.Categories.SingleOrDefault(x => x.Id == model.Id);

            if (!String.IsNullOrEmpty(data.Image) && data.Image != model.Image)
                ImageWorker.DeleteAllImages(data.Image, _configuration);

            data.Image = model.Image;
            data.Name = model.Name;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var data = _context.Categories.SingleOrDefault(x => x.Id == id);

            if (!String.IsNullOrEmpty(data.Image))
                ImageWorker.DeleteAllImages(data.Image, _configuration);

            _context.Categories.Remove(data);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
