namespace twActivitiest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class updateMessageMain : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Messages", "Main", c => c.String(nullable: false));
            DropColumn("dbo.Messages", "Name");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Messages", "Name", c => c.String(nullable: false));
            DropColumn("dbo.Messages", "Main");
        }
    }
}
