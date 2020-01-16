namespace twActivitiest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TEST : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Favorites", "MId", "dbo.Members");
            DropIndex("dbo.Favorites", new[] { "MId" });
            AlterColumn("dbo.Favorites", "MId", c => c.Int());
            CreateIndex("dbo.Favorites", "MId");
            AddForeignKey("dbo.Favorites", "MId", "dbo.Members", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Favorites", "MId", "dbo.Members");
            DropIndex("dbo.Favorites", new[] { "MId" });
            AlterColumn("dbo.Favorites", "MId", c => c.Int(nullable: false));
            CreateIndex("dbo.Favorites", "MId");
            AddForeignKey("dbo.Favorites", "MId", "dbo.Members", "Id", cascadeDelete: true);
        }
    }
}
