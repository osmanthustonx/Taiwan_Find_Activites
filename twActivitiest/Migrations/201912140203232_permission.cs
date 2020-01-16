namespace twActivitiest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class permission : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Members", "permission", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Members", "permission");
        }
    }
}
