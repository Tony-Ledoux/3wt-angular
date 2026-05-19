using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class Setup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "categories",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    category = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_categories", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "device_types",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    type = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_device_types", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "households",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    address = table.Column<string>(type: "text", nullable: true),
                    invite_code = table.Column<string>(type: "text", nullable: true),
                    is_open_for_invite = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_households", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "product_categories",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    category = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_product_categories", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "system_settings",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    key = table.Column<string>(type: "text", nullable: false),
                    value = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_system_settings", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "household_users",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    household_id = table.Column<int>(type: "integer", nullable: false),
                    household_owner = table.Column<bool>(type: "boolean", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_household_users", x => x.id);
                    table.ForeignKey(
                        name: "fk_household_users_households_household_id",
                        column: x => x.household_id,
                        principalTable: "households",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "products",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    product_name = table.Column<string>(type: "text", nullable: false),
                    default_unit = table.Column<string>(type: "text", nullable: true),
                    shelf_life_closed_days = table.Column<int>(type: "integer", nullable: true),
                    shelf_life_opened_days = table.Column<int>(type: "integer", nullable: true),
                    is_global = table.Column<bool>(type: "boolean", nullable: false),
                    household_id = table.Column<int>(type: "integer", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_products", x => x.id);
                    table.ForeignKey(
                        name: "fk_products_households_household_id",
                        column: x => x.household_id,
                        principalTable: "households",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "recipes",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
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
                    table.PrimaryKey("pk_recipes", x => x.id);
                    table.ForeignKey(
                        name: "fk_recipes_households_household_id",
                        column: x => x.household_id,
                        principalTable: "households",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "storage_locations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
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
                    table.PrimaryKey("pk_storage_locations", x => x.id);
                    table.ForeignKey(
                        name: "fk_storage_locations_device_types_device_type_id",
                        column: x => x.device_type_id,
                        principalTable: "device_types",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_storage_locations_households_household_id",
                        column: x => x.household_id,
                        principalTable: "households",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "storage_rules",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
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
                    table.PrimaryKey("pk_storage_rules", x => x.id);
                    table.ForeignKey(
                        name: "fk_storage_rules_device_types_device_type_id",
                        column: x => x.device_type_id,
                        principalTable: "device_types",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_storage_rules_product_categories_product_category_id",
                        column: x => x.product_category_id,
                        principalTable: "product_categories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "product_category_mapping",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    product_category_id = table.Column<int>(type: "integer", nullable: false),
                    product_id = table.Column<int>(type: "integer", nullable: false),
                    product_categories_id = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_product_category_mapping", x => x.id);
                    table.ForeignKey(
                        name: "fk_product_category_mapping_product_categories_product_categor",
                        column: x => x.product_categories_id,
                        principalTable: "product_categories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_product_category_mapping_product_categories_product_categor1",
                        column: x => x.product_category_id,
                        principalTable: "product_categories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_product_category_mapping_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "shoppinglists",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
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
                    table.PrimaryKey("pk_shoppinglists", x => x.id);
                    table.ForeignKey(
                        name: "fk_shoppinglists_household_users_added_by_user_id",
                        column: x => x.added_by_user_id,
                        principalTable: "household_users",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_shoppinglists_households_household_id",
                        column: x => x.household_id,
                        principalTable: "households",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_shoppinglists_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "recipe_category_mapping",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    recipe_id = table.Column<int>(type: "integer", nullable: false),
                    recipe_category_id = table.Column<int>(type: "integer", nullable: false),
                    recipes_id = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_recipe_category_mapping", x => x.id);
                    table.ForeignKey(
                        name: "fk_recipe_category_mapping_categories_recipe_category_id",
                        column: x => x.recipe_category_id,
                        principalTable: "categories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_recipe_category_mapping_recipes_recipe_id",
                        column: x => x.recipe_id,
                        principalTable: "recipes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_recipe_category_mapping_recipes_recipes_id",
                        column: x => x.recipes_id,
                        principalTable: "recipes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "recipe_ingredients",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
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
                    table.PrimaryKey("pk_recipe_ingredients", x => x.id);
                    table.ForeignKey(
                        name: "fk_recipe_ingredients_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_recipe_ingredients_recipes_recipe_id",
                        column: x => x.recipe_id,
                        principalTable: "recipes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "weekmenus",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
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
                    table.PrimaryKey("pk_weekmenus", x => x.id);
                    table.ForeignKey(
                        name: "fk_weekmenus_households_household_id",
                        column: x => x.household_id,
                        principalTable: "households",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_weekmenus_recipes_recipe_id",
                        column: x => x.recipe_id,
                        principalTable: "recipes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "inventories",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
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
                    table.PrimaryKey("pk_inventories", x => x.id);
                    table.ForeignKey(
                        name: "fk_inventories_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_inventories_recipes_recipe_id",
                        column: x => x.recipe_id,
                        principalTable: "recipes",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_inventories_storage_locations_storage_location_id",
                        column: x => x.storage_location_id,
                        principalTable: "storage_locations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "device_types",
                columns: new[] { "id", "created_at", "deleted_at", "type", "updated_at" },
                values: new object[,]
                {
                    { 1, new DateTime(2019, 12, 31, 23, 0, 0, 0, DateTimeKind.Utc), null, "Koelkast", null },
                    { 2, new DateTime(2019, 12, 31, 23, 0, 0, 0, DateTimeKind.Utc), null, "Diepvries", null },
                    { 3, new DateTime(2019, 12, 31, 23, 0, 0, 0, DateTimeKind.Utc), null, "Kast", null }
                });

            migrationBuilder.InsertData(
                table: "system_settings",
                columns: new[] { "id", "created_at", "deleted_at", "description", "key", "updated_at", "value" },
                values: new object[,]
                {
                    { 1, new DateTime(2019, 12, 31, 23, 0, 0, 0, DateTimeKind.Utc), null, "The maximum number of households a user can be part of.", "MaxHouseholdsPerUser", null, "5" },
                    { 2, new DateTime(2019, 12, 31, 23, 0, 0, 0, DateTimeKind.Utc), null, "The maximum number of households a user can own (this may not be higer than MaxHouseholdsPerUser)", "MaxUserOwns", null, "2" },
                    { 3, new DateTime(2019, 12, 31, 23, 0, 0, 0, DateTimeKind.Utc), null, "The max Lenght of a  invite code", "MaxInviteCodeLenght", null, "6" },
                    { 4, new DateTime(2019, 12, 31, 23, 0, 0, 0, DateTimeKind.Utc), null, "The Characters an invite code can consist of", "AllowedCharsInvite", null, "ABCDEFGHJKLMNPQRSTUVWXYZ23456789#?!" }
                });

            migrationBuilder.CreateIndex(
                name: "ix_household_users_household_id",
                table: "household_users",
                column: "household_id");

            migrationBuilder.CreateIndex(
                name: "ix_inventories_product_id",
                table: "inventories",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "ix_inventories_recipe_id",
                table: "inventories",
                column: "recipe_id");

            migrationBuilder.CreateIndex(
                name: "ix_inventories_storage_location_id",
                table: "inventories",
                column: "storage_location_id");

            migrationBuilder.CreateIndex(
                name: "ix_product_categories_category",
                table: "product_categories",
                column: "category",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_product_category_mapping_product_categories_id",
                table: "product_category_mapping",
                column: "product_categories_id");

            migrationBuilder.CreateIndex(
                name: "ix_product_category_mapping_product_category_id",
                table: "product_category_mapping",
                column: "product_category_id");

            migrationBuilder.CreateIndex(
                name: "ix_product_category_mapping_product_id",
                table: "product_category_mapping",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "ix_products_household_id",
                table: "products",
                column: "household_id");

            migrationBuilder.CreateIndex(
                name: "ix_recipe_category_mapping_recipe_category_id",
                table: "recipe_category_mapping",
                column: "recipe_category_id");

            migrationBuilder.CreateIndex(
                name: "ix_recipe_category_mapping_recipe_id",
                table: "recipe_category_mapping",
                column: "recipe_id");

            migrationBuilder.CreateIndex(
                name: "ix_recipe_category_mapping_recipes_id",
                table: "recipe_category_mapping",
                column: "recipes_id");

            migrationBuilder.CreateIndex(
                name: "ix_recipe_ingredients_product_id",
                table: "recipe_ingredients",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "ix_recipe_ingredients_recipe_id",
                table: "recipe_ingredients",
                column: "recipe_id");

            migrationBuilder.CreateIndex(
                name: "ix_recipes_household_id",
                table: "recipes",
                column: "household_id");

            migrationBuilder.CreateIndex(
                name: "ix_shoppinglists_added_by_user_id",
                table: "shoppinglists",
                column: "added_by_user_id");

            migrationBuilder.CreateIndex(
                name: "ix_shoppinglists_household_id",
                table: "shoppinglists",
                column: "household_id");

            migrationBuilder.CreateIndex(
                name: "ix_shoppinglists_product_id",
                table: "shoppinglists",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "ix_storage_locations_device_type_id",
                table: "storage_locations",
                column: "device_type_id");

            migrationBuilder.CreateIndex(
                name: "ix_storage_locations_household_id",
                table: "storage_locations",
                column: "household_id");

            migrationBuilder.CreateIndex(
                name: "ix_storage_rules_device_type_id",
                table: "storage_rules",
                column: "device_type_id");

            migrationBuilder.CreateIndex(
                name: "ix_storage_rules_product_category_id",
                table: "storage_rules",
                column: "product_category_id");

            migrationBuilder.CreateIndex(
                name: "ix_weekmenus_household_id",
                table: "weekmenus",
                column: "household_id");

            migrationBuilder.CreateIndex(
                name: "ix_weekmenus_recipe_id",
                table: "weekmenus",
                column: "recipe_id");

            migrationBuilder.CreateIndex(
                name: "ix_weekmenus_serving_date_household_id",
                table: "weekmenus",
                columns: new[] { "serving_date", "household_id" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "inventories");

            migrationBuilder.DropTable(
                name: "product_category_mapping");

            migrationBuilder.DropTable(
                name: "recipe_category_mapping");

            migrationBuilder.DropTable(
                name: "recipe_ingredients");

            migrationBuilder.DropTable(
                name: "shoppinglists");

            migrationBuilder.DropTable(
                name: "storage_rules");

            migrationBuilder.DropTable(
                name: "system_settings");

            migrationBuilder.DropTable(
                name: "weekmenus");

            migrationBuilder.DropTable(
                name: "storage_locations");

            migrationBuilder.DropTable(
                name: "categories");

            migrationBuilder.DropTable(
                name: "household_users");

            migrationBuilder.DropTable(
                name: "products");

            migrationBuilder.DropTable(
                name: "product_categories");

            migrationBuilder.DropTable(
                name: "recipes");

            migrationBuilder.DropTable(
                name: "device_types");

            migrationBuilder.DropTable(
                name: "households");
        }
    }
}
