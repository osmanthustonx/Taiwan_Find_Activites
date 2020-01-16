namespace twActivitiest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addSalt : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Members", "Password", c => c.String(nullable: false, maxLength: 100));
            AlterColumn("dbo.Members", "PasswordSalt", c => c.String(maxLength: 100));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Members", "PasswordSalt", c => c.String(maxLength: 500));
            DropColumn("dbo.Members", "Password");
        }
    }
}
