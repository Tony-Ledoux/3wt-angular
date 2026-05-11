using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    category = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DeviceTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    type = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeviceTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Households",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    adress = table.Column<string>(type: "text", nullable: true),
                    invite_code = table.Column<string>(type: "text", nullable: true),
                    is_open_for_invite = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Households", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Recipes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    instructions = table.Column<string>(type: "text", nullable: false),
                    shelf_life_days = table.Column<int>(type: "integer", nullable: true),
                    household_id = table.Column<int>(type: "integer", nullable: true),
                    is_global = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recipes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HouseholdUsers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    household_id = table.Column<int>(type: "integer", nullable: false),
                    household_owner = table.Column<bool>(type: "boolean", nullable: false),
                    email = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HouseholdUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HouseholdUsers_Households_household_id",
                        column: x => x.household_id,
                        principalTable: "Households",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StorageLocations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    device_type_id = table.Column<int>(type: "integer", nullable: false),
                    household_id = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StorageLocations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StorageLocations_DeviceTypes_device_type_id",
                        column: x => x.device_type_id,
                        principalTable: "DeviceTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StorageLocations_Households_household_id",
                        column: x => x.household_id,
                        principalTable: "Households",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RecipeCategoryMappings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    recipe_id = table.Column<int>(type: "integer", nullable: false),
                    recipe_category_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecipeCategoryMappings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecipeCategoryMappings_Categories_recipe_category_id",
                        column: x => x.recipe_category_id,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RecipeCategoryMappings_Recipes_recipe_id",
                        column: x => x.recipe_id,
                        principalTable: "Recipes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Weekmenus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    serving_date = table.Column<DateOnly>(type: "date", nullable: false),
                    recipe_id = table.Column<int>(type: "integer", nullable: false),
                    household_id = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Weekmenus", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Weekmenus_Households_household_id",
                        column: x => x.household_id,
                        principalTable: "Households",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Weekmenus_Recipes_recipe_id",
                        column: x => x.recipe_id,
                        principalTable: "Recipes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Inventories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    storage_location_id = table.Column<int>(type: "integer", nullable: false),
                    product_id = table.Column<int>(type: "integer", nullable: true),
                    recipe_id = table.Column<int>(type: "integer", nullable: true),
                    quantity = table.Column<double>(type: "double precision", nullable: false),
                    unit = table.Column<string>(type: "text", nullable: true),
                    expiry_date = table.Column<DateOnly>(type: "date", nullable: true),
                    date_in = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    date_opened = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inventories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Inventories_Recipes_recipe_id",
                        column: x => x.recipe_id,
                        principalTable: "Recipes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    category = table.Column<string>(type: "text", nullable: false),
                    ProductCategoryMappingId = table.Column<int>(type: "integer", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StorageRules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    device_type_id = table.Column<int>(type: "integer", nullable: false),
                    product_category_id = table.Column<int>(type: "integer", nullable: false),
                    multiplier = table.Column<double>(type: "double precision", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StorageRules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StorageRules_DeviceTypes_device_type_id",
                        column: x => x.device_type_id,
                        principalTable: "DeviceTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StorageRules_ProductCategories_product_category_id",
                        column: x => x.product_category_id,
                        principalTable: "ProductCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductCategoryMappings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    product_category_id = table.Column<int>(type: "integer", nullable: false),
                    product_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductCategoryMappings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductCategoryMappings_ProductCategories_product_category_~",
                        column: x => x.product_category_id,
                        principalTable: "ProductCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    product_name = table.Column<string>(type: "text", nullable: false),
                    default_unit = table.Column<string>(type: "text", nullable: true),
                    shelf_life_closed_days = table.Column<int>(type: "integer", nullable: true),
                    shelf_life_opened_days = table.Column<int>(type: "integer", nullable: true),
                    is_global = table.Column<bool>(type: "boolean", nullable: false),
                    household_id = table.Column<int>(type: "integer", nullable: true),
                    ProductCategoryMappingId = table.Column<int>(type: "integer", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Products_Households_household_id",
                        column: x => x.household_id,
                        principalTable: "Households",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Products_ProductCategoryMappings_ProductCategoryMappingId",
                        column: x => x.ProductCategoryMappingId,
                        principalTable: "ProductCategoryMappings",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "RecipeIngredients",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    recipe_id = table.Column<int>(type: "integer", nullable: false),
                    product_id = table.Column<int>(type: "integer", nullable: false),
                    quantity = table.Column<double>(type: "double precision", nullable: false),
                    unit = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecipeIngredients", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecipeIngredients_Products_product_id",
                        column: x => x.product_id,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RecipeIngredients_Recipes_recipe_id",
                        column: x => x.recipe_id,
                        principalTable: "Recipes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Shoppinglists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    household_id = table.Column<int>(type: "integer", nullable: false),
                    product_id = table.Column<int>(type: "integer", nullable: false),
                    quantity = table.Column<double>(type: "double precision", nullable: false),
                    unit = table.Column<string>(type: "text", nullable: true),
                    purchased_on = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    added_by_user_id = table.Column<int>(type: "integer", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shoppinglists", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Shoppinglists_HouseholdUsers_added_by_user_id",
                        column: x => x.added_by_user_id,
                        principalTable: "HouseholdUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Shoppinglists_Households_household_id",
                        column: x => x.household_id,
                        principalTable: "Households",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Shoppinglists_Products_product_id",
                        column: x => x.product_id,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HouseholdUsers_household_id",
                table: "HouseholdUsers",
                column: "household_id");

            migrationBuilder.CreateIndex(
                name: "IX_Inventories_product_id",
                table: "Inventories",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_Inventories_recipe_id",
                table: "Inventories",
                column: "recipe_id");

            migrationBuilder.CreateIndex(
                name: "IX_ProductCategories_category",
                table: "ProductCategories",
                column: "category",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductCategories_ProductCategoryMappingId",
                table: "ProductCategories",
                column: "ProductCategoryMappingId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductCategoryMappings_product_category_id",
                table: "ProductCategoryMappings",
                column: "product_category_id");

            migrationBuilder.CreateIndex(
                name: "IX_ProductCategoryMappings_product_id",
                table: "ProductCategoryMappings",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_Products_household_id",
                table: "Products",
                column: "household_id");

            migrationBuilder.CreateIndex(
                name: "IX_Products_ProductCategoryMappingId",
                table: "Products",
                column: "ProductCategoryMappingId");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeCategoryMappings_recipe_category_id",
                table: "RecipeCategoryMappings",
                column: "recipe_category_id");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeCategoryMappings_recipe_id",
                table: "RecipeCategoryMappings",
                column: "recipe_id");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeIngredients_product_id",
                table: "RecipeIngredients",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeIngredients_recipe_id",
                table: "RecipeIngredients",
                column: "recipe_id");

            migrationBuilder.CreateIndex(
                name: "IX_Shoppinglists_added_by_user_id",
                table: "Shoppinglists",
                column: "added_by_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_Shoppinglists_household_id",
                table: "Shoppinglists",
                column: "household_id");

            migrationBuilder.CreateIndex(
                name: "IX_Shoppinglists_product_id",
                table: "Shoppinglists",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_StorageLocations_device_type_id",
                table: "StorageLocations",
                column: "device_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_StorageLocations_household_id",
                table: "StorageLocations",
                column: "household_id");

            migrationBuilder.CreateIndex(
                name: "IX_StorageRules_device_type_id",
                table: "StorageRules",
                column: "device_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_StorageRules_product_category_id",
                table: "StorageRules",
                column: "product_category_id");

            migrationBuilder.CreateIndex(
                name: "IX_Weekmenus_household_id",
                table: "Weekmenus",
                column: "household_id");

            migrationBuilder.CreateIndex(
                name: "IX_Weekmenus_recipe_id",
                table: "Weekmenus",
                column: "recipe_id");

            migrationBuilder.CreateIndex(
                name: "IX_Weekmenus_serving_date_household_id",
                table: "Weekmenus",
                columns: new[] { "serving_date", "household_id" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Inventories_Products_product_id",
                table: "Inventories",
                column: "product_id",
                principalTable: "Products",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductCategories_ProductCategoryMappings_ProductCategoryMa~",
                table: "ProductCategories",
                column: "ProductCategoryMappingId",
                principalTable: "ProductCategoryMappings",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductCategoryMappings_Products_product_id",
                table: "ProductCategoryMappings",
                column: "product_id",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Households_household_id",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductCategoryMappings_Products_product_id",
                table: "ProductCategoryMappings");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductCategories_ProductCategoryMappings_ProductCategoryMa~",
                table: "ProductCategories");

            migrationBuilder.DropTable(
                name: "Inventories");

            migrationBuilder.DropTable(
                name: "RecipeCategoryMappings");

            migrationBuilder.DropTable(
                name: "RecipeIngredients");

            migrationBuilder.DropTable(
                name: "Shoppinglists");

            migrationBuilder.DropTable(
                name: "StorageLocations");

            migrationBuilder.DropTable(
                name: "StorageRules");

            migrationBuilder.DropTable(
                name: "Weekmenus");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "HouseholdUsers");

            migrationBuilder.DropTable(
                name: "DeviceTypes");

            migrationBuilder.DropTable(
                name: "Recipes");

            migrationBuilder.DropTable(
                name: "Households");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "ProductCategoryMappings");

            migrationBuilder.DropTable(
                name: "ProductCategories");
        }
    }
}
