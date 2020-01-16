namespace twActivitiest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addAllDatabase5 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Foods",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CId = c.Int(nullable: false),
                        Name = c.String(nullable: false, maxLength: 100),
                        Longitude = c.String(maxLength: 100),
                        Latitude = c.String(maxLength: 100),
                        Address = c.String(maxLength: 100),
                        Time = c.String(),
                        TEL = c.String(maxLength: 30),
                        Image = c.String(),
                        InitDate = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Cities", t => t.CId, cascadeDelete: true)
                .Index(t => t.CId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Foods", "CId", "dbo.Cities");
            DropIndex("dbo.Foods", new[] { "CId" });
            DropTable("dbo.Foods");
        }
    }
}
