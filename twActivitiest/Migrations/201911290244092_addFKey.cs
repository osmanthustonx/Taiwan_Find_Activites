namespace twActivitiest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addFKey : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Favorites", "MId", c => c.Int(nullable: false));
            AddColumn("dbo.Messages", "MId", c => c.Int(nullable: false));
            CreateIndex("dbo.Favorites", "MId");
            CreateIndex("dbo.Messages", "MId");
            AddForeignKey("dbo.Favorites", "MId", "dbo.Members", "Id", cascadeDelete: true);
            AddForeignKey("dbo.Messages", "MId", "dbo.Members", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Messages", "MId", "dbo.Members");
            DropForeignKey("dbo.Favorites", "MId", "dbo.Members");
            DropIndex("dbo.Messages", new[] { "MId" });
            DropIndex("dbo.Favorites", new[] { "MId" });
            DropColumn("dbo.Messages", "MId");
            DropColumn("dbo.Favorites", "MId");
        }
    }
}
