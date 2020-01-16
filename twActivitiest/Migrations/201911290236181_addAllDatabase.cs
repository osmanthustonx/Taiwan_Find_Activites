namespace twActivitiest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addAllDatabase : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Members",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 50),
                        Birth = c.DateTime(nullable: false),
                        Gender = c.Int(nullable: false),
                        Email = c.String(nullable: false, maxLength: 200),
                        PasswordSalt = c.String(maxLength: 500),
                        Image = c.String(),
                        InitDate = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Members");
        }
    }
}
