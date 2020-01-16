namespace twActivitiest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addcccc : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Exhibitions", "Name", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Exhibitions", "Name", c => c.String(nullable: false, maxLength: 50));
        }
    }
}
