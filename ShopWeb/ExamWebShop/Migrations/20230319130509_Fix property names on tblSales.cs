using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExamWebShop.Migrations
{
    /// <inheritdoc />
    public partial class FixpropertynamesontblSales : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SaleName",
                table: "tblSales",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "SaleDescription",
                table: "tblSales",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "ImagePath",
                table: "tblSales",
                newName: "Image");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "tblSales",
                newName: "SaleName");

            migrationBuilder.RenameColumn(
                name: "Image",
                table: "tblSales",
                newName: "ImagePath");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "tblSales",
                newName: "SaleDescription");
        }
    }
}
