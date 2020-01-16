namespace twActivitiest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addAllDatabase4 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Exhibitions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        PId = c.Int(nullable: false),
                        Name = c.String(nullable: false, maxLength: 50),
                        StartDate = c.DateTime(),
                        EndDate = c.DateTime(),
                        Image = c.String(),
                        website = c.String(),
                        InitDate = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Places", t => t.PId, cascadeDelete: true)
                .Index(t => t.PId);
            
            AddColumn("dbo.Favorites", "EId", c => c.Int(nullable: false));
            AddColumn("dbo.Messages", "EId", c => c.Int(nullable: false));
            CreateIndex("dbo.Favorites", "EId");
            CreateIndex("dbo.Messages", "EId");
            AddForeignKey("dbo.Favorites", "EId", "dbo.Exhibitions", "Id", cascadeDelete: true);
            AddForeignKey("dbo.Messages", "EId", "dbo.Exhibitions", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Exhibitions", "PId", "dbo.Places");
            DropForeignKey("dbo.Messages", "EId", "dbo.Exhibitions");
            DropForeignKey("dbo.Favorites", "EId", "dbo.Exhibitions");
            DropIndex("dbo.Messages", new[] { "EId" });
            DropIndex("dbo.Favorites", new[] { "EId" });
            DropIndex("dbo.Exhibitions", new[] { "PId" });
            DropColumn("dbo.Messages", "EId");
            DropColumn("dbo.Favorites", "EId");
            DropTable("dbo.Exhibitions");
        }
    }
}
