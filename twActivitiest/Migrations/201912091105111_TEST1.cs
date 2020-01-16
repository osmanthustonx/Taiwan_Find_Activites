namespace twActivitiest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TEST1 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Places", "CId", "dbo.Cities");
            DropForeignKey("dbo.Favorites", "MId", "dbo.Members");
            DropIndex("dbo.Places", new[] { "CId" });
            DropIndex("dbo.Favorites", new[] { "MId" });
            AlterColumn("dbo.Places", "CId", c => c.Int());
            AlterColumn("dbo.Favorites", "MId", c => c.Int(nullable: false));
            CreateIndex("dbo.Places", "CId");
            CreateIndex("dbo.Favorites", "MId");
            AddForeignKey("dbo.Places", "CId", "dbo.Cities", "Id");
            AddForeignKey("dbo.Favorites", "MId", "dbo.Members", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Favorites", "MId", "dbo.Members");
            DropForeignKey("dbo.Places", "CId", "dbo.Cities");
            DropIndex("dbo.Favorites", new[] { "MId" });
            DropIndex("dbo.Places", new[] { "CId" });
            AlterColumn("dbo.Favorites", "MId", c => c.Int());
            AlterColumn("dbo.Places", "CId", c => c.Int(nullable: false));
            CreateIndex("dbo.Favorites", "MId");
            CreateIndex("dbo.Places", "CId");
            AddForeignKey("dbo.Favorites", "MId", "dbo.Members", "Id");
            AddForeignKey("dbo.Places", "CId", "dbo.Cities", "Id", cascadeDelete: true);
        }
    }
}
