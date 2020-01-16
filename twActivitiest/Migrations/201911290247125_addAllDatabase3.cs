namespace twActivitiest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addAllDatabase3 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Cities",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 100),
                        InitDate = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Places",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CId = c.Int(nullable: false),
                        Name = c.String(nullable: false, maxLength: 100),
                        Longitude = c.String(maxLength: 100),
                        Latitude = c.String(maxLength: 100),
                        InitDate = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Cities", t => t.CId, cascadeDelete: true)
                .Index(t => t.CId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Places", "CId", "dbo.Cities");
            DropIndex("dbo.Places", new[] { "CId" });
            DropTable("dbo.Places");
            DropTable("dbo.Cities");
        }
    }
}
