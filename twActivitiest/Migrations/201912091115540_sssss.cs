namespace twActivitiest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class sssss : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Places", "CId", "dbo.Cities");
            DropIndex("dbo.Places", new[] { "CId" });
            AlterColumn("dbo.Places", "CId", c => c.Int());
            CreateIndex("dbo.Places", "CId");
            AddForeignKey("dbo.Places", "CId", "dbo.Cities", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Places", "CId", "dbo.Cities");
            DropIndex("dbo.Places", new[] { "CId" });
            AlterColumn("dbo.Places", "CId", c => c.Int());
            CreateIndex("dbo.Places", "CId");
            AddForeignKey("dbo.Places", "CId", "dbo.Cities", "Id");
        }
    }
}
